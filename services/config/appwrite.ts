import { Client, Account } from '@icarus00x/react-native-appwrite-expo-newarch';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67e8502e001a780507c5')
    .setPlatform('com.icarus.renderwear');


const account = new Account(client);
account;

export { account, client };

