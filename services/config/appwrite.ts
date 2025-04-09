import { Client, Account, ID } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('67e8502e001a780507c5')
    .setPlatform('com.comm.facefashion');

const account = new Account(client);
account
export { account };