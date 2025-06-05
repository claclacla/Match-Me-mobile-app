import React, { useState } from 'react';
import { Layout, Input, Button, Text as UIText } from '@ui-kitten/components'; 
import { StyleSheet } from 'react-native';

const MyTextAreaButtonScreen = (): React.ReactElement => {
  const [textValue, setTextValue] = useState<string>(''); 

  const handleButtonPress = (): void => {

  };

  return (
    <Layout style={styles.screenContainer}>
      <UIText category='h5' style={styles.title}>Bio</UIText> 

      <Input
        style={styles.input}
        placeholder='Insert your bio...'
        value={textValue}
        onChangeText={(nextValue: string) => setTextValue(nextValue)} 
        multiline={true}
        numberOfLines={4}
        textStyle={{ minHeight: 64, textAlignVertical: 'top' }}
      />

      <Button
        style={styles.button}
        onPress={handleButtonPress}
      >
        Send
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
});

export default MyTextAreaButtonScreen;