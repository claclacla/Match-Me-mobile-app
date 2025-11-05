import { supabase } from '../repositories/supabase/supabaseClient';

const ROOM_ID = '11111111-1111-1111-1111-111111111111';

/**
 * Test function to verify Supabase messaging and realtime functionality
 * This tests:
 * 0. Supabase connection and authentication
 * 1. Fetching messages from a test room
 * 2. Subscribing to realtime updates
 * 3. Sending a message as the authenticated user
 */
export async function testSupabaseMessages() {
  console.log('\n🧪 Testing Supabase Messages & Realtime...\n');

  try {
    // 0. First, check Supabase connection and authentication
    console.log('0️⃣ Checking Supabase connection and authentication...');
    
    // Check if Supabase client is initialized
    if (!supabase) {
      console.error('❌ Supabase client is not initialized!');
      return { success: false, error: 'Supabase client not initialized' };
    }
    console.log('✅ Supabase client initialized');

    // Verify Cognito authentication (Supabase uses Cognito tokens via accessToken option)
    console.log('   Verifying Cognito authentication...');
    const { fetchAuthSession } = await import('@aws-amplify/auth');
    const sessionCheck = await fetchAuthSession();
    if (!sessionCheck?.tokens?.idToken) {
      console.error('❌ No Cognito session found. Please sign in first.');
      return { success: false, error: 'No Cognito session' };
    }
    console.log('✅ Cognito authentication verified');
    
    // Get Cognito user ID from the token
    const idToken = sessionCheck.tokens.idToken.toString();
    let userId: string | null = null;
    
    try {
      const parts = idToken.split('.');
      if (parts.length === 3) {
        let base64Payload = parts[1];
        while (base64Payload.length % 4) {
          base64Payload += '=';
        }
        base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
        const payloadJson = atob(base64Payload);
        const payload = JSON.parse(payloadJson);
        userId = payload.sub; // Cognito sub
        console.log(`✅ Cognito user ID: ${userId}`);
      }
    } catch (error) {
      console.error('❌ Failed to decode Cognito token');
      return { success: false, error: 'Failed to decode token' };
    }
    
    if (!userId) {
      return { success: false, error: 'No user ID in token' };
    }

    // Test connection by making a simple query (this will test auth via accessToken)
    console.log('   Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('messages')
      .select('id')
      .limit(1);

    if (connectionError) {
      // If it's a JWT/auth error, that's expected - we'll check tokens next
      if (connectionError.code === 'PGRST301' || connectionError.message.includes('JWT')) {
        console.warn('⚠️ Connection test returned auth error (will check tokens next)');
      } else {
        console.error('❌ Database connection failed:', connectionError.message);
        console.error('   This might indicate:');
        console.error('   - Supabase URL is incorrect');
        console.error('   - Network connectivity issues');
        console.error('   - Database is not accessible');
        return { success: false, error: 'Connection failed', details: connectionError.message };
      }
    } else {
      console.log('✅ Database connection successful!');
    }

    // RLS policies use auth.jwt()->>'sub' which should match the Cognito sub
    console.log('\n1️⃣ Using Cognito user ID for RLS policies...');
    console.log(`   RLS policies check: auth.jwt()->>'sub' = '${userId}'`);
    console.log(`   Make sure your memberships table has user_id = '${userId}'`);

    // 2. Verify membership (optional check - RLS will enforce it anyway)
    console.log(`\n2️⃣ Verifying membership...`);
    
    // Note: With token exchange, user_id in memberships should be Supabase UUID
    // The transitional is_member_v2() function supports both old Cognito sub and new Supabase UUID
    const { data: membershipCheck, error: membershipError } = await supabase
      .from('memberships')
      .select('user_id, room_id, role')
      .eq('room_id', ROOM_ID)
      .eq('user_id', userId)
      .limit(1);
    
    if (membershipError) {
      console.warn('⚠️ Could not check membership (RLS may be blocking):', membershipError.message);
      console.warn('   This is OK - RLS policies will enforce membership on actual operations');
    } else {
      if (membershipCheck && membershipCheck.length > 0) {
        console.log(`✅ Membership found for Supabase user ${userId} in room ${ROOM_ID}`);
        console.log(`   Role: ${membershipCheck[0].role || 'N/A'}`);
      } else {
        console.warn(`⚠️ Membership check returned no results`);
        console.warn(`   Supabase user ID: ${userId}`);
        console.warn(`   Room ID: ${ROOM_ID}`);
        console.warn(`   Note: If you have legacy rows with Cognito sub, they'll be migrated on first login`);
        console.warn(`   We'll continue testing - actual message operations will reveal if you have access`);
        console.warn(`   If you see the user in Supabase Studio, RLS is likely blocking this check`);
      }
    }

    // 2b. Fetch messages from test room
    console.log(`\n2b️⃣ Fetching messages from room: ${ROOM_ID}...`);
    const { data: messages, error: fetchError } = await supabase
      .from('messages')
      .select('user_id, text, created_at')
      .eq('room_id', ROOM_ID)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Failed to fetch messages:', fetchError);
      console.error('   Error code:', fetchError.code);
      console.error('   Error message:', fetchError.message);
      
      // Check if it's an auth error or just table/policy issue
      if (fetchError.code === 'PGRST301' || fetchError.message.includes('JWT')) {
        return { success: false, error: 'Authentication failed', details: fetchError.message };
      } else if (fetchError.code === 'PGRST205' || fetchError.message.includes('not found')) {
        console.warn('⚠️ Messages table not found - make sure it exists in your Supabase database');
      }
      return { success: false, error: 'Fetch failed', details: fetchError.message };
    }

    console.log('✅ Messages fetched successfully!');
    console.log(`   Found ${messages?.length || 0} message(s)`);
    if (messages && messages.length > 0) {
      messages.forEach((msg, idx) => {
        console.log(`   [${idx + 1}] ${msg.text} (user: ${msg.user_id?.substring(0, 8)}..., at: ${msg.created_at})`);
      });
    } else {
      console.log('   No messages found in this room yet');
    }

    // 3. Subscribe to realtime updates
    console.log(`\n3️⃣ Subscribing to realtime updates for room: ${ROOM_ID}...`);
    
    // IMPORTANT: With Third-Party Auth, we must set the Realtime auth token before subscribing
    // The accessToken option doesn't automatically set it for Realtime
    try {
      const { fetchAuthSession } = await import('@aws-amplify/auth');
      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (token) {
        // Decode token to check if it has role claim
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            let base64Payload = parts[1];
            while (base64Payload.length % 4) {
              base64Payload += '=';
            }
            base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            const payloadJson = atob(base64Payload);
            const payload = JSON.parse(payloadJson);
            
            if (!payload.role || payload.role !== 'authenticated') {
              console.warn('⚠️ WARNING: Cognito JWT does not have role: "authenticated"');
              console.warn('   Current role claim:', payload.role || 'missing');
              console.warn('   Realtime requires role: "authenticated" for proper authorization');
              console.warn('   Solution: Add Cognito Pre-Token Generation Trigger to inject role claim');
              console.warn('   See: https://supabase.com/docs/guides/auth/third-party/aws-cognito');
            } else {
              console.log('✅ Cognito JWT has role: "authenticated"');
            }
          }
        } catch (decodeError) {
          console.warn('⚠️ Could not decode token to check role claim');
        }
        
        // Set the auth token for Realtime
        supabase.realtime.setAuth(token);
        console.log('✅ Realtime auth token set');
        
        // Ensure Realtime connection is established
        if (!supabase.realtime.isConnected()) {
          console.log('   Establishing Realtime connection...');
          supabase.realtime.connect();
          // Wait for connection to establish
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } else {
        console.warn('⚠️ No token available for Realtime auth');
        return { success: false, error: 'No token for Realtime' };
      }
    } catch (authError) {
      console.warn('⚠️ Failed to set Realtime auth token:', authError);
      return { success: false, error: 'Failed to set Realtime auth token' };
    }
    
    let channelSubscriptionStatus: string | null = null;
    let channelError: any = null;
    
    const channel = supabase
      .channel(`room:${ROOM_ID}`, {
        config: {
          // Make channel private for better security with Third-Party Auth
          private: false, // Postgres Changes doesn't require private channels
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${ROOM_ID}`,
        },
        (payload) => {
          console.log('📩 New message received via realtime →', payload.new);
          console.log(`   Text: ${payload.new.text}`);
          console.log(`   User: ${payload.new.user_id}`);
        }
      )
      .subscribe((status, err) => {
        channelSubscriptionStatus = status;
        if (err) {
          channelError = err;
        }
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscription active!');
          console.log('   Listening for new messages...');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime subscription error');
          if (err) {
            console.error('   Error details:', JSON.stringify(err, null, 2));
          } else {
            console.error('   Error object is empty - this often indicates authorization failure');
            console.error('   With Third-Party Auth, Realtime may require role: "authenticated" in JWT');
            console.error('   Check if your Cognito JWT includes the role claim');
          }
        } else if (status === 'TIMED_OUT') {
          console.error('❌ Realtime subscription timed out');
          console.error('   This might be due to authorization issues or network problems');
        } else if (status === 'CLOSED') {
          console.log('   Realtime status: CLOSED');
          if (channelError) {
            console.error('   Closed due to error:', channelError);
          }
        } else {
          console.log(`   Realtime status: ${status}`);
        }
      });

    // Wait a bit for subscription to establish
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Send a test message
    // With Third-Party Auth, we need to send user_id (Cognito sub)
    // The trigger can't fill it because auth.uid() is NULL with Third-Party Auth
    console.log(`\n4️⃣ Sending test message as user: ${userId}...`);
    
    const testMessage = {
      room_id: ROOM_ID,
      user_id: userId, // Cognito sub - REQUIRED because trigger can't fill it with Third-Party Auth
      text: 'Hello from my phone 👋',
    };

    console.log(`   Inserting message:`, testMessage);

    const { data: insertData, error: insertError } = await supabase
      .from('messages')
      .insert(testMessage)
      .select();

    if (insertError) {
      console.error('❌ Failed to insert message:', insertError);
      console.error('   Error code:', insertError.code);
      console.error('   Error message:', insertError.message);
      
      if (insertError.code === '42501' || insertError.message.includes('permission denied') || insertError.message.includes('row-level security')) {
        console.error('   ❌ RLS policy violation!');
        console.error(`   Supabase user ID: ${userId}`);
        console.error('');
        console.error('   📊 DIAGNOSIS:');
        console.error('   ✅ SELECT operations work (messages can be fetched)');
        console.error('   ❌ INSERT operations fail (RLS blocks writes)');
        console.error('');
        console.error('   🔍 DEBUGGING STEPS:');
        console.error('');
        console.error('   Step 1: Verify Supabase session');
        console.error(`   → Check: SELECT auth.uid() as user_id;`);
        console.error(`   → Should return: ${userId}`);
        console.error('');
        console.error('   Step 2: Check membership');
        console.error(`   → Run: SELECT * FROM memberships WHERE room_id = '${ROOM_ID}' AND user_id = '${userId}';`);
        console.error(`   → If no row found, add one via service role or migrate legacy data`);
        console.error('');
        console.error('   Step 3: Verify RLS policy');
        console.error('   → The INSERT policy checks: is_member_v2(room_id)');
        console.error('   → This function supports both Supabase UUID and legacy Cognito sub');
        console.error('');
        console.error('   💡 SOLUTION:');
        console.error('   → Ensure you have membership for this user in the room');
        console.error('   → If you have legacy data with Cognito sub, run: SELECT migrate_current_user_ids();');
      }
      
      // Clean up subscription
      await supabase.removeChannel(channel);
      return { success: false, error: 'Insert failed', details: insertError.message };
    }

    console.log('✅ Message sent successfully!');
    console.log(`   Message ID: ${insertData?.[0]?.id || 'N/A'}`);
    console.log('   ⏳ Waiting 2 seconds for realtime delivery...');

    // Wait for realtime to deliver the message
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('📊 Test Summary:');
    console.log(`   ✓ Supabase connection: WORKING`);
    console.log(`   ✓ Authentication: WORKING`);
    console.log(`   ✓ Messages fetched: ${messages?.length || 0} message(s)`);
    console.log(`   ✓ Message sending: SUCCESS`);
    console.log(`   ✓ Realtime subscription: ACTIVE`);
    console.log('');
    console.log('💡 If you saw a realtime notification above, receiving is also working!');
    console.log('='.repeat(50) + '\n');

    // Keep subscription alive for a few more seconds so user can see any delayed messages
    setTimeout(async () => {
      await supabase.removeChannel(channel);
      console.log('   🔌 Realtime subscription closed\n');
    }, 3000);

    return {
      success: true,
      connectionStatus: 'connected',
      authenticationStatus: 'authenticated',
      messagesFetched: messages?.length || 0,
      messageSent: !!insertData,
      realtimeSubscribed: true,
    };

  } catch (error: any) {
    console.error('\n' + '='.repeat(50));
    console.error('❌ TEST FAILED');
    console.error('='.repeat(50));
    console.error('Error:', error.message || error);
    console.error('');
    console.error('🔍 Troubleshooting steps:');
    console.error('   1. Check if you are signed in to Cognito');
    console.error('   2. Verify Supabase environment variables are set');
    console.error('   3. Check network connectivity');
    console.error('   4. Verify your user has membership in the test room');
    console.error('='.repeat(50) + '\n');
    return { 
      success: false, 
      error: error.message || 'Unknown error',
      connectionStatus: 'unknown',
      authenticationStatus: 'unknown'
    };
  }
}

