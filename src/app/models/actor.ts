import { Ban } from './ban';
import { Entity } from "./entity.model";
import { Role } from "../enums/RoleEnum";

export class Actor extends Entity{

  private _name: string;
  private _surname: string;
  private _email: string;
  private _password: string;
  private _phone!: string;
  private _address!: string;
  private _role: Role;
  private _ban!: Ban
  private _customToken!: string;

  constructor() {
    super();
    this._name = '';
    this._surname = '';
    this._email = '';
    this._password = '';
    this._role = Role.EXPLORER;
  }

  public get name(): string {
    return this._name;
  }
  public get surname(): string {
    return this._surname;
  }
  public get email(): string {
    return this._email;
  }
  public get password(): string {
    return this._password;
  }
  public get phone(): string {
    return this._phone;
  }
  public get address(): string {
    return this._address;
  }
  public get role(): Role {
    return this._role;
  }
  public get ban(): Ban {
    return this._ban;
  }
  public get customToken(): string {
    return this._customToken;
  }

  public set name(name: string) {
    this._name = name;
  }
  public set surname(surname: string) {
    this._surname = surname;
  }
  public set email(email: string) {
    this._email = email;
  }
  public set password(password: string) {
    this._password = password;
  }
  public set phone(phone: string) {
    this._phone = phone;
  }
  public set address(address: string) {
    this._address = address;
  }
  public set role(role: Role) {
    this._role = role;
  }
  public set ban(ban: Ban) {
    this._ban = ban;
  }
  public set customToken(token: string) {
    this._customToken = token;
  }

}
