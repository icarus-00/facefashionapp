import SafeAreaView from '@/components/atoms/safeview/safeview';
import HelpPageTemplate from "@/components/pages/helpPages/template";
import { helpPagesContent } from "@/constants/helpPages";
import { ScrollView } from 'react-native-gesture-handler';
export default function HelpPage2() {
    return (
        <SafeAreaView >
            <ScrollView>
            <HelpPageTemplate
                header="prompting"
                sections={helpPagesContent.help2.sections}
            />
            </ScrollView>
        </SafeAreaView>
    )
}