import { SliderProps } from "@/components/atoms/slider/interface";
const image1 = require("@/assets/images/onboarding/imagesTest/FrameC.png");
const image2 = require("@/assets/images/onboarding/imagesTest/FrameD.png");
const image3 = require("@/assets/images/onboarding/imagesTest/FrameE.png");
const data = [
    {
        image: image1,
        title: "Virtual Costume Fitting for Cinema Professionals",
        description: "Upload outfit images and visualize them on actor models, streamlining costume design for your productions.",
    },
    {
        image: image2,
        title: "Personalized Virtual Try-On Experiences",
        description: "Create from your photos to virtually try on outfits, ensuring the perfect look before making a choice.",
    },
    {
        image: image3,
        title: "AI-Powered Custom Outfit Generation",
        description: "Describe your fashion ideas, and our AI transforms them into unique outfit designs.",
    }
] as SliderProps[];


export default data;