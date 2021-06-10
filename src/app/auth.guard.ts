import {CanActivate, Router, Data} from '@angular/router';
import {Injectable} from '@angular/core';
import {DataService} from './services/data.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';

@Injectable()
export class NeedAuthGuard implements CanActivate {

  constructor(private dataService: DataService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];

    if (this.dataService.isLogged()) {
      return true;
    }
    this.router.navigateByUrl(
      this.router.createUrlTree(
        ['/'], {
        }
      )
    );

    return false;
  }
}