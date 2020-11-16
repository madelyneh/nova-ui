import orderBy from "lodash/orderBy";

import { D3Selection, ILasagnaLayer } from "./types";

/** @ignore */
export class Lasagna {
    public static CONTAINER_CLASS = "lasagna-container";
    public static LAYER_CLASS = "lasagna-layer";

    public layers: ILasagnaLayer[] = [];
    private readonly container: D3Selection<SVGGElement>;

    constructor(target: D3Selection<SVGSVGElement>, private readonly clipPath: string) {
        this.container = target.append("g").attr("class", `${Lasagna.CONTAINER_CLASS} pointer-events`);
    }

    public addLayer(layer: ILasagnaLayer): D3Selection {
        this.layers = orderBy(this.layers.concat(layer), "order");

        this.update();

        return this.getLayerContainer(layer.name);
    }

    public removeLayer(layerName: string): void {
        const index = this.layers.findIndex((layer) => layer.name === layerName);
        if (index === -1) {
            return;
        }

        this.layers.splice(index, 1);
        this.update();
    }

    public getLayerContainer(name: string): D3Selection {
        return this.container.select(`.${Lasagna.LAYER_CLASS}-${name}`);
    }

    public getContainer(): D3Selection<SVGGElement> {
        return this.container;
    }

    private update() {
        const layerContainers = this.container.selectAll<SVGElement, ILasagnaLayer>(`g.${Lasagna.LAYER_CLASS}`)
            .data(this.layers, (d: ILasagnaLayer) => d.name)
            .order();

        layerContainers.enter()
            .append("g")
            .attrs({
                "class": (d: ILasagnaLayer) => `${Lasagna.LAYER_CLASS} ${Lasagna.LAYER_CLASS}-${d.name}`,
                "clip-path": (d: ILasagnaLayer) => d.clipped ? `url(#${this.clipPath})` : "",
                "pointer-events": "none",
            });

        layerContainers.exit()
            .remove();
    }
}
