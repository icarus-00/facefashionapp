import SafeAreaView from '@/components/atoms/safeview/safeview';
import HelpPageTemplate from "@/components/pages/helpPages/template";
import { helpPagesContent } from "@/constants/helpPages";
import { ScrollView } from 'react-native-gesture-handler';
export default function HelpPage4() {
    return (
        <SafeAreaView >
            <ScrollView>
            <HelpPageTemplate
                header="Image Generation"
                sections={helpPagesContent.help4.sections}
            />
            </ScrollView>
        </SafeAreaView>
    )
}