function getRandomColor() {
    let letters = "0123456789ABCDEF".split("");
    let color = "#";

    for (let i = 0; i < 6; ++i) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function borderColorToBgColor(hex) {
    if (/^#[A-Fa-f\d]{6}$/.test(hex)) {
        const c = `0x${hex.substring(1)}`;

        return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
            ", "
        )}, 0.5)`;
    }

    return null;
}

export function getChartBackgroundColors(count) {
    const borderColors = [];
    const bgColors = [];

    for (let i = 0; i < count; ++i) {
        let borderColor = getRandomColor();
        let bgColor = borderColorToBgColor(borderColor);

        if (!bgColor) {
            borderColor = "rgb(53, 162, 235)";
            bgColor = "rgba(53, 162, 235, 0.5)";
        }

        borderColors.push(borderColor);
        bgColors.push(bgColor);
    }

    return { borderColors, bgColors };
}
