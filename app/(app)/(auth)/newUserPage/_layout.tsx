import { Stack } from "expo-router";

export default function LayoutNewuser()
{
    return(
    <Stack>
        
        <Stack.Screen name="newUser" options={{ headerShown:true , title:"finish signup"}} />

    </Stack>
    )
}