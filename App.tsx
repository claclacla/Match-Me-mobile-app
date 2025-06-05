import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components'; 
import { StyleSheet } from 'react-native';

import MyTextAreaButtonScreen from './MyTextAreaButtonScreen';

export default function App(): React.ReactElement {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <MyTextAreaButtonScreen />
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});