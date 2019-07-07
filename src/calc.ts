enum Item {
    FISH = "Flatulent Fish",
    VEG = "Sweet Sea Vegetable",
    EYE = "Slimy Naga Eyeball",
    MASS = "Unidentified Mass",
    JAR = "Jar of Fish Faces",
    BAG = "Bag of Who-Knows-What",
    BUTTER = "Just Regular Butter",
    GLOOP = "Smelly Pile of Gloop",
    ROCK = "Particularly Dense Rock",
    STONE = "Beckoner's Rosetta Stone",
    FINGER = "Cultist Pinky Finger",
    IDOL = "Overwhelmingly-Alluring Idol",
    LUNCH = "Healthy Murloc Lunch",
    FOOD = "Ghost Food",
    HORN = "Curious Murloc Horn",
    SOCK = "Dirty/Clean Murloc Sock",
    DUST = "Sea Giant Foot Dust",
    SCULPTURE = "Disintegrating Sand Sculpture",
    SNAIL = "Extra-Slimy Snail",
    BLOOD = "Pulsating Blood Stone"
}

export enum Quality {
    COMMON = 0,
    UNCOMMON = 1,
    RARE = 2,
    EPIC = 3
}

enum Vendor {
    GRRMRLG = "Grrmrlg",
    HURLGRL = "Hurlgrl",
    FLRGRRL = "Flrgrrl",
    MRRGLRLR = "Mrrglrlr",
    MRRL = "Mrrl"
}

export type Cost = {
    [y in Item]?: number
}

type Inventory = {
    name: Item;
    cost?: Cost;
    vendor: Vendor;
    quality: Quality;
}

type Step = {
    item: Item;
    quantity: number;
    vendor: Vendor;
    quality: Quality;
}

export const inventory: Inventory[] = [
    {
        name: Item.FISH,
        vendor: Vendor.GRRMRLG,
        quality: Quality.COMMON
    },
    {
        name: Item.VEG,
        vendor: Vendor.HURLGRL,
        quality: Quality.COMMON
    },
    {
        name: Item.EYE,
        vendor: Vendor.MRRGLRLR,
        quality: Quality.COMMON
    },
    {
        name: Item.MASS,
        vendor: Vendor.FLRGRRL,
        quality: Quality.COMMON
    },
    {
        name: Item.HORN,
        cost: {
            [Item.EYE]: 3
        },
        vendor: Vendor.GRRMRLG,
        quality: Quality.UNCOMMON
    },
    {
        name: Item.LUNCH,
        cost: {
            [Item.HORN]: 5
        },
        vendor: Vendor.HURLGRL,
        quality: Quality.RARE
    },
    {
        name: Item.FOOD,
        cost: {
            [Item.HORN]: 6
        },
        vendor: Vendor.FLRGRRL,
        quality: Quality.RARE
    },
    {
        name: Item.SNAIL,
        cost: {
            [Item.SCULPTURE]: 5
        },
        vendor: Vendor.GRRMRLG,
        quality: Quality.RARE
    },
    {
        name: Item.SCULPTURE,
        cost: {
            [Item.VEG]: 4
        },
        vendor: Vendor.MRRGLRLR,
        quality: Quality.UNCOMMON
    },
    {
        name: Item.DUST,
        cost: {
            [Item.SOCK]: 3
        },
        vendor: Vendor.GRRMRLG,
        quality: Quality.RARE
    },
    {
        name: Item.SOCK,
        cost: {
            [Item.MASS]: 6
        },
        vendor: Vendor.HURLGRL,
        quality: Quality.UNCOMMON
    },
    {
        name: Item.JAR,
        cost: {
            [Item.FISH]: 5
        },
        vendor: Vendor.HURLGRL,
        quality: Quality.UNCOMMON
    },
    {
        name: Item.BAG,
        cost: {
            [Item.FISH]: 2
        },
        vendor: Vendor.FLRGRRL,
        quality: Quality.UNCOMMON
    },
    {
        name: Item.BUTTER,
        cost: {
            [Item.VEG]: 4
        },
        vendor: Vendor.FLRGRRL,
        quality: Quality.UNCOMMON
    },
    {
        name: Item.GLOOP,
        cost: {
            [Item.BUTTER]: 2
        },
        vendor: Vendor.MRRGLRLR,
        quality: Quality.RARE
    },
    {
        name: Item.ROCK,
        cost: {
            [Item.BAG]: 3,
            [Item.JAR]: 3
        },
        vendor: Vendor.MRRGLRLR,
        quality: Quality.RARE
    },
    {
        name: Item.STONE,
        cost: {
            [Item.GLOOP]: 2,
            [Item.ROCK]: 9
        },
        vendor: Vendor.FLRGRRL,
        quality: Quality.EPIC
    },
    {
        name: Item.FINGER,
        cost: {
            [Item.GLOOP]: 4,
            [Item.FOOD]: 7
        },
        vendor: Vendor.HURLGRL,
        quality: Quality.EPIC
    },
    {
        name: Item.IDOL,
        cost: {
            [Item.LUNCH]: 8,
            [Item.FOOD]: 4
        },
        vendor: Vendor.GRRMRLG,
        quality: Quality.EPIC
    },
    {
        name: Item.BLOOD,
        cost: {
            [Item.DUST]: 8,
            [Item.LUNCH]: 7
        },
        vendor: Vendor.MRRGLRLR,
        quality: Quality.EPIC
    }
];

function getSteps(want: Item, quantity: number): Step[] {
    const item = inventory.find(i => i.name === want);

    const steps = [];

    if (item !== undefined) {
        if (item.cost) {
            for (const x in item.cost) {
                const mat = x as Item;
                const cost = item.cost[mat as Item];
                steps.unshift(...getSteps(mat, cost! * quantity));
            }
        }

        steps.push({
            item: want,
            quantity,
            vendor: item.vendor,
            quality: item.quality
        });
    }

    return steps;
}

export function getCosts(cost: Cost): Step[] {
    const items = Object.keys(cost) as Item[];
    const steps = items.reduce((acc: Step[], want: Item) => {
        const steps = cost[want]! > 0 ? getSteps(want, cost[want]!) : [];
        return [...acc, ...steps];
    }, []);

    steps.sort((a, b) => {
        const diff = a.quality - b.quality;
        return diff || b.vendor.localeCompare(a.vendor);
    });

    return steps.reduce((acc: Step[], step, i) => {
        if (i + 1 < steps.length && step.item === steps[i + 1].item) {
            steps[i + 1].quantity += step.quantity;
        } else {
            acc.push(step);
        }

        return acc;
    }, []);
}
