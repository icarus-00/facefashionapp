import HelpPageTemplate from "@/components/pages/helpPages/template";
import { ScrollView } from "react-native/Libraries/Components/ScrollView/ScrollView";
import { helpPagesContent } from "@/constants/helpPages";
export default function HelpPage1() {
    return (
        <ScrollView>
            <HelpPageTemplate
                header="prompting"
                sections={helpPagesContent.help2.sections}
            />
        </ScrollView>
    )
}