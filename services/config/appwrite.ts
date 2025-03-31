import { Client, Account, ID } from 'react-native-appwrite';

const client = new Client()
    .setProject('67e8502e001a780507c5')
    .setPlatform('com.comm.facefashion');

const account = new Account(client);
export { account };