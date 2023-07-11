export class TabInfo {
    constructor(title,favicon) {
        this._title = title
        this._favicon = favicon
    }

    // Getter
    get title() {
    return this._title;
    }
    get favicon() {
    return this._favicon
    }
    // Setter
    set title(value) {
        this._title = value
    }
    set favicon(value) {
        this._favicon = value
    }
}