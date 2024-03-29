import { Grid } from "./grid";
import {
    IDimensions,
    IGrid,
} from "./types";

/** @ignore */
export class RadialGrid extends Grid implements IGrid {

    public build(): IGrid {
        super.build();
        this.recenter();

        return this;
    }

    public updateDimensions(dimensions: IDimensions): IGrid {
        this.config().dimension
            .outerWidth(dimensions.width)
            .outerHeight(dimensions.height);

        // TODO: Chart's update: this.grid.scales = collectScales(seriesSet) may not yet happened
        if (this.scales) {
            const radiusScale = this.scales["r"];
            if (radiusScale) {
                radiusScale.list[0].range([0, Math.min(this.config().dimension.width(), this.config().dimension.height()) / 2]);
            }
        }

        this.adjustRenderingArea();
        this.updateRanges();
        // This setTimeout is for the safari browser which has problems rendering radial charts during animations
        // e.g. inside an expander that opens with an animation
        setTimeout(() => {
            this.recenter();
        });

        return this;
    }

    /** @deprecated - Deprecated in favor of adjustRenderingArea - Removal ticket NUI-3273 */
    protected adjustClipPath = () => {
        this.adjustRenderingArea();
    }

    protected adjustRenderingArea = () => {
        const d = this.config().dimension;
        const attrs = {
            "width": d.width(),
            "height": d.height(),
            "transform": `translate(${-d.width() / 2}, ${-d.height() / 2})`,
        };
        this.renderingAreaClipPath.attrs(attrs);
        this.renderingArea.attrs(attrs);
    }

    private recenter() {
        this.container.attrs({
            "transform": `translate(${this.config().dimension.width() / 2},${this.config().dimension.height() / 2})`,
        });
    }
}
