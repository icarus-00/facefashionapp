import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { account } from "@/services/config/appwrite";
import { useRouter } from "expo-router";

const ProfileSettings = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSave = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (username) await account.updateName(username);
            if (email && password) await account.updateEmail(email, password);
            setSuccess("Profile updated!");
        } catch (e: any) {
            setError(e.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (password) {
                await account.updatePassword(password);
                setSuccess("Password updated!");
            }
        } catch (e: any) {
            setError(e.message || "Password update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 24, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Edit Profile</Text>
            <Text style={{ marginBottom: 4 }}>Username</Text>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16 }}
                value={username}
                onChangeText={setUsername}
                placeholder="New username"
                autoCapitalize="none"
            />
            <Text style={{ marginBottom: 4 }}>Email</Text>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16 }}
                value={email}
                onChangeText={setEmail}
                placeholder="New email"
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <Text style={{ marginBottom: 4 }}>New Password</Text>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16 }}
                value={password}
                onChangeText={setPassword}
                placeholder="New password"
                secureTextEntry
            />
            {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
            {success ? <Text style={{ color: 'green', marginBottom: 8 }}>{success}</Text> : null}
            <TouchableOpacity
                style={{ backgroundColor: '#000', borderRadius: 8, padding: 16, marginBottom: 12 }}
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Save Changes</Text>}
            </TouchableOpacity>
            <TouchableOpacity
                style={{ backgroundColor: '#eee', borderRadius: 8, padding: 16, marginBottom: 12 }}
                onPress={handlePasswordChange}
                disabled={loading || !password}
            >
                <Text style={{ color: '#000', textAlign: 'center', fontWeight: 'bold' }}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={{ color: '#007AFF', textAlign: 'center', marginTop: 16 }}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileSettings;
