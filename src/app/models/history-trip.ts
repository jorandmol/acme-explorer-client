export class HistoryTrip {
  private __id: string;
  private _title: string;
  private _url: string;
  private _ticker: string;
  private _date: Date;

  constructor() {
    this.__id = '';
    this._title = '';
    this._url = '';
    this._ticker = '';
    this._date = new Date();
  }

  get _id(): string {
    return this.__id;
  }

  set _id(value: string) {
    this.__id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get ticker(): string {
    return this._ticker;
  }

  set ticker(value: string) {
    this._ticker = value;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

}
