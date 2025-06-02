import React from 'react';
import SafeAreaView from '@/components/atoms/safeview/safeview';
import HelpPageTemplate from "@/components/pages/helpPages/template";
import { helpPagesContent } from "@/constants/helpPages";
import { ScrollView } from 'react-native-gesture-handler';
export default function HelpPage1() {
    return (
        <SafeAreaView >
            <ScrollView>
            <HelpPageTemplate
                header="Generation Kickstart"
                sections={helpPagesContent.help1.sections}
            /></ScrollView>
        </SafeAreaView>
    );
}