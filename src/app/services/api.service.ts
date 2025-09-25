import {
  inject,
  Injectable
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ICharacter } from '../interfaces/ICharacter';
import { IEpisode } from '../interfaces/IEpisode';
import { ICharacters } from '../interfaces/ICharacters';
import { ILocations } from '../interfaces/ILocations';
import { ILocation } from '../interfaces/ILocation';
import { Observable } from 'rxjs';
import { IEpisodes } from '../interfaces/IEpisodes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly URL = 'https://rickandmortyapi.com/api';
  private readonly _http: HttpClient = inject(HttpClient);

  public getAllCharacters(): Observable<ICharacters> {
    return this._http.get<ICharacters>(`${this.URL}/character`);
  }

  public getCharacterById(id: number): Observable<ICharacter> {
    return this._http.get<ICharacter>(`${this.URL}/character/${id}`);
  }

  public getCharacterByUrl(url: string): Observable<ICharacter> {
    return this._http.get<ICharacter>(url);
  }

  public getAllLocations(): Observable<ILocations> {
    return this._http.get<ILocations>(`${this.URL}/location`);
  }

  public getLocationById(id: number): Observable<ILocation> {
    return this._http.get<ILocation>(`${this.URL}/location/${id}`);
  }

  public getLocationByUrl(url: string): Observable<ILocation> {
    return this._http.get<ILocation>(url);
  }

  public getAllEpisodes(): Observable<IEpisodes> {
    return this._http.get<IEpisodes>(`${this.URL}/episode`)
  }

  public getEpisodeById(id: number): Observable<IEpisode> {
    return this._http.get<IEpisode>(`${this.URL}/episode/${id}`);
  }

  public getEpisodeByUrl(url: string): Observable<IEpisode> {
    return this._http.get<IEpisode>(url);
  }
}
