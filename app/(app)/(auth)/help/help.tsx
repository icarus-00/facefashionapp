import SafeAreaView from "@/components/atoms/safeview/safeview"
import { Text } from "react-native"
import { ListItemButtonGroup } from "@rneui/base/dist/ListItem/ListItem.ButtonGroup"
import { ListItem } from "@rneui/themed"
import { helpPagesContent } from "@/constants/helpPages"
import { useRouter } from "expo-router"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

export default function HelpPage()
{
    const router = useRouter()
    return (
        <SafeAreaView>
            <Text>Help Page</Text>
            {Object.values(helpPagesContent).map((item, index) => (
                <ListItem key={index} onPress={() => router.push({ pathname: `/(app)/(auth)/help/(pages)/help${index+1}` as any })}>
                    <ListItem.Content>
                        <ListItem.Title>{item.header}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}
        </SafeAreaView>
    )
}