import {
    browser,
    by,
    element,
    ExpectedConditions
} from "protractor";

import { Atom } from "../../atom";
import { OverlayAtom } from "../overlay/overlay.atom";

import { SelectV2OptionAtom } from "./select-v2-option.atom";

export class BaseSelectV2Atom extends Atom {
    public popup: OverlayAtom = Atom.findIn(OverlayAtom, element(by.tagName("body")));

    public getPopupElement() {
        return this.popup.getElement();
    }

    public async toggle(): Promise<void> {
        await this.getElement().click();
        await this.waitForPopup();
    }

    public async getOption(index: number): Promise<SelectV2OptionAtom> {
        if (! await this.popup.isOpened()) {
            await this.toggle();
        }
        return Atom.findIn(SelectV2OptionAtom, this.popup.getElement(), index);
    }

    public async getFirstOption(): Promise<SelectV2OptionAtom> {
        return this.getOption(0);
    }

    public async getLastOption(): Promise<SelectV2OptionAtom> {
        const count = await Atom.findCount(SelectV2OptionAtom, this.getElement());
        return this.getOption(count - 1);
    }

    public async countOptions(): Promise<number> {
        if (! await this.popup.isOpened()) {
            await this.toggle();
        }
        return Atom.findCount(SelectV2OptionAtom, this.popup.getElement());
    }

    public async isOpened(): Promise<boolean> {
        return this.popup.isOpened();
    }

    public async getActiveItemsCount(): Promise<number> {
        return this.popup.getElement().all(by.className("active")).count();
    }

    public async type(text: string) {
        await this.getElement().click();
        return browser.actions().sendKeys(text).perform();
    }

    public click = async (): Promise<void> => this.getElement().click();

    public async isSelectDisabled(): Promise<boolean> {
        const classAttr = await (this.getElement().getAttribute("class"));
        return classAttr.includes("disabled");
    }

    private async waitForPopup() {
        return await browser.wait(ExpectedConditions.visibilityOf(this.popup.getElement()));
    }
}
