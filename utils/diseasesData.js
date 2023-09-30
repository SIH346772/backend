const diseasesData = {
    "Winter": [
        {
            "DiseaseName": "Powdery Mildew",
            "CropsAffected": ["Winter Squash", "Kale", "Cabbage"],
            "Prevention": ["Prune affected leaves for better air circulation", "Apply fungicides preventively"]
        },
        {
            "DiseaseName": "Gray Mold",
            "CropsAffected": ["Grapes", "Strawberries", "Certain Vegetables"],
            "Prevention": ["Ensure proper ventilation in greenhouses and storage areas", "Keep the environment dry; avoid overwatering"]
        },
        {
            "DiseaseName": "Root Rots",
            "CropsAffected": ["Carrots", "Beets", "Winter Greens"],
            "Prevention": ["Plant in well-drained soil to prevent waterlogging", "Rotate crops to prevent soil-borne pathogen buildup"]
        },
        {
            "DiseaseName": "Downy Mildew",
            "CropsAffected": ["Spinach", "Lettuce", "Other Leafy Greens"],
            "Prevention": ["Use drip irrigation to keep foliage dry", "Apply fungicides preventively"]
        },
        {
            "DiseaseName": "Snow Mold",
            "CropsAffected": ["Winter Wheat", "Rye", "Other Cereals"],
            "Prevention": ["Ensure proper field drainage to prevent waterlogging", "Avoid excessive fertilization"]
        },
        {
            "DiseaseName": "Late Blight",
            "CropsAffected": ["Potatoes", "Tomatoes"],
            "Prevention": ["Store tubers in a cool, dry place after harvest", "Apply copper-based fungicides preventively in late fall"]
        },
        {
            "DiseaseName": "Anthracnose",
            "CropsAffected": ["Winter Squash", "Beans"],
            "Prevention": ["Rotate crops to disrupt disease cycles", "Remove and destroy infected plant material"]
        },
        {
            "DiseaseName": "Wheat Rusts",
            "CropsAffected": ["Wheat"],
            "Prevention": ["Plant wheat varieties resistant to rust diseases", "Apply fungicides preventively in high-risk areas"]
        }
    ],
    "Summer": [
        {
            "DiseaseName": "Blossom End Rot",
            "CropsAffected": ["Tomatoes", "Peppers", "Squash"],
            "Prevention": ["Ensure consistent and deep watering to prevent calcium deficiencies", "Mulch around plants to maintain soil moisture levels"]
        },
        {
            "DiseaseName": "Aphids",
            "CropsAffected": ["Beans", "Cucumbers", "Melons"],
            "Prevention": ["Introduce natural predators like ladybugs or lacewings", "Use insecticidal soap or neem oil to deter aphids"]
        },
        {
            "DiseaseName": "Spider Mites",
            "CropsAffected": ["Beans", "Tomatoes", "Strawberries"],
            "Prevention": ["Maintain high humidity levels around plants", "Spray plants with a strong stream of water to remove mites"]
        },
        {
            "DiseaseName": "Cucumber Mosaic Virus",
            "CropsAffected": ["Cucumbers", "Tomatoes", "Melons"],
            "Prevention": ["Use disease-resistant varieties", "Control aphid populations, which often spread the virus"]
        },
        {
            "DiseaseName": "Septoria Leaf Spot",
            "CropsAffected": ["Tomatoes", "Peppers"],
            "Prevention": ["Water plants at the base to avoid splashing soil onto leaves", "Apply fungicides containing copper or sulfur preventively"]
        },
        {
            "DiseaseName": "Fusarium Wilt",
            "CropsAffected": ["Watermelons", "Cucumbers", "Cantaloupes"],
            "Prevention": ["Plant disease-resistant varieties", "Rotate crops to prevent soil buildup of the pathogen"]
        },
        {
            "DiseaseName": "Japanese Beetle Damage",
            "CropsAffected": ["Various fruits and vegetables"],
            "Prevention": ["Handpick beetles from plants in the early morning when they are sluggish", "Use row covers to protect vulnerable plants"]
        },
        {
            "DiseaseName": "Squash Vine Borer",
            "CropsAffected": ["Squash", "Pumpkins", "Zucchinis"],
            "Prevention": ["Wrap the base of young plants with aluminum foil to deter egg-laying moths", "Apply insecticides containing neem oil or spinosad"]
        }
    ],
    "Fall": [
        {
            "DiseaseName": "Fusarium Wilt",
            "CropsAffected": ["Various plants including Tomatoes, Cucumbers, and Melons"],
            "Prevention": ["Plant disease-resistant varieties", "Rotate crops to prevent soil buildup of the pathogen"]
        },
        {
            "DiseaseName": "White Mold",
            "CropsAffected": ["Beans", "Lettuce", "Peas"],
            "Prevention": ["Provide proper spacing between plants for air circulation", "Avoid excessive irrigation; maintain moderate soil moisture"]
        },
        {
            "DiseaseName": "Onion Downy Mildew",
            "CropsAffected": ["Onions", "Garlic"],
            "Prevention": ["Plant disease-resistant onion varieties", "Provide good drainage and avoid overhead watering"]
        },
        {
            "DiseaseName": "Rust Diseases Roses",
            "CropsAffected": ["Roses"],
            "Prevention" : ["Prune affected branches and dispose of them properly", "Apply fungicides preventively during the growing season"]
        },
        {
            "DiseaseName": "Carrot Rust Fly",
            "CropsAffected": ["Carrots", "Parsnips"],
            "Prevention": ["Use floating row covers to prevent adult flies from laying eggs on plants", "Practice crop rotation and avoid planting carrots in the same area consecutively"]
        },
        {
            "DiseaseName": "Tomato Hornworm",
            "CropsAffected": ["Tomatoes", "Peppers", "Eggplants"],
            "Prevention": ["Handpick hornworms from plants and destroy them", "Introduce natural predators like parasitic wasps"]
        },
        {
            "DiseaseName": "Cedar Apple Rust",
            "CropsAffected": ["Apples", "Cedars"],
            "Prevention": ["Remove cedar trees near apple orchards if possible", "Apply fungicides during the apple tree's active growing period"]
        },
        {
            "DiseaseName": "Collar Rot",
            "CropsAffected": ["Various plants including Shrubs and Trees"],
            "Prevention": ["Plant in well-drained soil", "Avoid excessive watering; maintain proper soil moisture levels"]
        },
        {
            "DiseaseName": "Gummy Stem Blight",
            "CropsAffected": ["Cucumbers", "Melons", "Squash"],
            "Prevention": ["Provide good air circulation by proper spacing of plants", "Avoid overhead watering to prevent moisture on leaves"]
        },
        {
            "DiseaseName": "Late Season Tomato Diseases",
            "CropsAffected": ["Tomatoes"],
            "Prevention": ["Remove and dispose of diseased plant material", "Harvest mature fruits promptly to prevent diseases from spreading"]
        }
    ],
    "Spring": [
        {
            "DiseaseName": "Damping Off",
            "CropsAffected": ["Seedlings of various plants"],
            "Prevention": ["Use sterilized soil or growing media for seedlings", "Provide good air circulation and avoid overwatering"]
        },
        {
            "DiseaseName": "Powdery Mildew",
            "CropsAffected": ["Grapes", "Apples", "Peas"],
            "Prevention": ["Plant disease-resistant varieties", "Apply fungicides preventively, especially during periods of high humidity"]
        },
        {
            "DiseaseName": "Apple Scab",
            "CropsAffected": ["Apples", "Pears"],
            "Prevention": ["Prune trees to improve air circulation", "Apply fungicides during the tree's dormant season"]
        },
        {
            "DiseaseName": "Fire Blight",
            "CropsAffected": ["Apples", "Pears"],
            "Prevention": ["Prune infected branches well below the affected area", "Apply copper-based fungicides during the dormant season"]
        },
        {
            "DiseaseName": "Early Blight",
            "CropsAffected": ["Tomatoes", "Potatoes"],
            "Prevention": ["Remove and destroy infected plant material", "Practice crop rotation to prevent soil buildup of the pathogen"]
        },
        {
            "DiseaseName": "Cedar Apple Rust",
            "CropsAffected": ["Apples", "Cedars"],
            "Prevention": ["Remove cedar trees near apple orchards if possible", "Apply fungicides during the apple tree's active growing period"]
        },
        {
            "DiseaseName": "Leaf Spot Diseases",
            "CropsAffected": ["Various plants including Roses", "Ornamentals"],
            "Prevention": ["Water plants at the base to avoid wetting foliage", "Apply fungicides preventively if conditions favor disease development"]
        },
        {
            "DiseaseName": "Onion White Rot",
            "CropsAffected": ["Onions", "Garlic"],
            "Prevention": ["Practice crop rotation with non-host plants", "Avoid planting onions in areas with a history of the disease"]
        },
        {
            "DiseaseName": "Cabbage Worms",
            "CropsAffected": ["Cabbage", "Broccoli", "Cauliflower"],
            "Prevention": ["Introduce natural predators like parasitic wasps", "Use row covers to protect young plants from adult butterflies"]
        }
    ]
};

function getSeason(currentMonth){
    if(currentMonth == 12 || currentMonth == 1 || currentMonth == 2){
        return "Winter";
    } else if(currentMonth >= 3 && currentMonth <= 5){
        return "Spring";
    } else if(currentMonth >= 6 && currentMonth <= 8){
        return "Summer";
    } else {
        return "Fall";
    }
}

function getDiseasesData(){
    var today = new Date();
    var currentMonth = today.getMonth() + 1;
    var season = getSeason(currentMonth);
    var diseases = diseasesData[season];
    return diseases
}

module.exports = getDiseasesData;