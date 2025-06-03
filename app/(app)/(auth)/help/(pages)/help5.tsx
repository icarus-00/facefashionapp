import SafeAreaView from '@/components/atoms/safeview/safeview';
import HelpPageTemplate from "@/components/pages/helpPages/template";
import { helpPagesContent } from "@/constants/helpPages";
import { ScrollView } from 'react-native-gesture-handler';

export default function HelpPage5() {
    return (
        <SafeAreaView >
            <ScrollView>
            <HelpPageTemplate
                header="Video Generation"
                sections={helpPagesContent.help5.sections}
            />
            </ScrollView>
        </SafeAreaView>
    )
}