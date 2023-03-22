import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { Actor } from '../models/actor';
import { Role } from "../enums/RoleEnum";
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private http: HttpClient) { }

  registerUser(actor: Actor) {
    return new Promise((resolve, reject) => {
      this.fireAuth.createUserWithEmailAndPassword(actor.email, actor.password)
        .then(_ => {
          // if the authentication was ok, then we proceed
          const headers = new HttpHeaders();
          headers.append('Content-Type', 'application/json');
          const url = `${environment.backendApiBaseUrl + '/v2/actors'}`;
          const body = JSON.stringify(actor);
          this.http.post(url, body, httpOptions).toPromise()
            .then(res => {
              resolve(res);
            }, err => {
              reject(err);
            });
        }).catch(err => {
          reject(err);
        });
    });
  }

  getRoles(): string[] {
    return Object.values(Role);
  }

  login(email: string, password: string) {
    const url = environment.backendApiBaseUrl + '/v1/login';
    const body = { email, password }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return new Promise<any>((resolve, reject) => {
      this.http.post<Actor>(url, body).toPromise()
        .then(res => {
          if (res) {
            this.fireAuth.signInWithCustomToken(res.customToken)
            .then(userCredentials => {
              const user = new User();
              userCredentials.user?.getIdToken()
                .then((token: string) => {
                  user.token = token;
                  user.email = userCredentials.user?.uid ?? '';
                  this.setCurrentUser(user);
                  resolve(user);
                })
                .catch(error => {
                  reject({ error: { message: 'No token retrieved' } });
                })
            })
            .catch(error => {
              console.log(error);
              reject(error);
            });
          } else {
            reject({ error: { message: 'Problem while login' } });
          }
        }, error => {
          reject(error);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  logout() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signOut()
        .then(_ => {
          localStorage.clear();
          resolve('');
        }).catch(error => {
          reject(error);
        });
    });
  }

  setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        resolve(JSON.parse(currentUser));
      } else {
        resolve(null);
      }
    });
  }

}
