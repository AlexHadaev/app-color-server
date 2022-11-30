export interface IColorScheme{
    length: number,
    [index: number]: {
        typeColor: string,
        rgb: number[][]
    }
}

export const colorScheme:IColorScheme = [
    {
        typeColor: "yellow",
        rgb: [
            [225, 255],
            [165, 225],
            [0, 50]
        ]
    },
    {
        typeColor: "orange",
        rgb: [
            [230, 255],
            [130, 140],
            [50, 80]
        ]

    },
    {
        typeColor: "brown",
        rgb: [
            [110, 154],
            [60, 90],
            [3, 50]
        ]
    },
    {
        typeColor: "purple",
        rgb: [
            [120, 160],
            [10, 100],
            [150, 210]
        ]
    },
    {
        typeColor: "blue",
        rgb: [
            [0, 70],
            [0, 150],
            [200, 255]
        ]
    },
    {
        typeColor: "red",
        rgb: [
            [200, 255],
            [0, 70],
            [0, 70]
        ]
    },
    {
        typeColor: "green",
        rgb: [
            [10, 50],
            [80, 255],
            [10, 50]
        ]
    },
    {
        typeColor: "grey",
        rgb: [
            [118, 128],
            [118, 128],
            [118, 128]
        ]
    }
]
