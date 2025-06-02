import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

// Types for help page sections
type HelpSection =
    | { type: 'text'; text: string; image?: string }
    | { type: 'steps'; text: string }
    | { type: 'bullet'; text: string }
    | { type: 'callout'; text: string };

interface HelpPageTemplateProps {
    header: string;
    sections: HelpSection[];
}

const HelpPageTemplate: React.FC<HelpPageTemplateProps> = ({ header, sections }) => {
    // Helper to render each section type
    const renderSection = (section: HelpSection, idx: number) => {
        switch (section.type) {
            case 'text':
                return (
                    <View key={idx} style={styles.textSection}>
                        {section.image && (
                            <Image source={{ uri: section.image }} style={styles.image} resizeMode="contain" />
                        )}
                        <Text style={styles.text}>{section.text}</Text>
                    </View>
                );
            case 'steps': {
                // Split steps by number-dot pattern (e.g., '1. step 2. step')
                const steps = section.text.match(/\d+\.[^\d]+/g) || [section.text];
                return (
                    <View key={idx} style={styles.stepsSection}>
                        {steps.map((step, i) => (
                            <View key={i} style={styles.stepItem}>
                                <Text style={styles.stepNumber}>{i + 1}.</Text>
                                <Text style={styles.stepText}>{step.replace(/\d+\.\s*/, '')}</Text>
                            </View>
                        ))}
                    </View>
                );
            }
            case 'bullet': {
                // Split bullets by '- ' pattern
                const bullets = section.text.split(/-\s+/).filter(Boolean);
                return (
                    <View key={idx} style={styles.bulletSection}>
                        {bullets.map((b, i) => (
                            <View key={i} style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>{'\u2022'}</Text>
                                <Text style={styles.bulletText}>{b.trim()}</Text>
                            </View>
                        ))}
                    </View>
                );
            }
            case 'callout':
                return (
                    <View key={idx} style={styles.calloutSection}>
                        <Text style={styles.calloutText}>{section.text}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{header}</Text>
            {sections.map(renderSection)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: 600,
        alignSelf: 'center',
        padding: 24,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    textSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: 48,
        height: 48,
        marginRight: 12,
    },
    text: {
        fontSize: 16,
        flex: 1,
    },
    stepsSection: {
        marginBottom: 16,
        paddingLeft: 8,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    stepNumber: {
        fontWeight: 'bold',
        marginRight: 6,
    },
    stepText: {
        flex: 1,
        fontSize: 16,
    },
    bulletSection: {
        marginBottom: 16,
        paddingLeft: 8,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    bulletPoint: {
        fontSize: 18,
        marginRight: 8,
        lineHeight: 22,
    },
    bulletText: {
        flex: 1,
        fontSize: 16,
    },
    calloutSection: {
        backgroundColor: '#f5f5dc',
        borderLeftWidth: 4,
        borderLeftColor: '#f5a623',
        padding: 12,
        marginBottom: 16,
    },
    calloutText: {
        fontSize: 16,
    },
});
HelpPageTemplate.displayName = "HelpPageTemplate"
export default HelpPageTemplate;
