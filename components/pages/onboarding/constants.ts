import { SliderProps } from "@/components/atoms/slider/interface";
const image1 = require("@/assets/images/onboarding/6ba5ff7971edcecaca983ef32c260ca8f545dd5e.png");
const image2 = require("@/assets/images/onboarding/2102d9dac756c58d37a7d3e7c15af8cb925db375.png");
const image3 = require("@/assets/images/onboarding/12978031_5094663.jpg");
const data = [
    {
        image: image1,
        title: "Welcome to the app",
        description: "This is a sample onboarding screen",
    },
    {
        image: image2,
        title: "Explore the features",
        description: "Discover the amazing features of this app",
    },
    {
        image: image3,
        title: "Get started",
        description: "Let's get started with the app",
    }
] as SliderProps[];


export default data;