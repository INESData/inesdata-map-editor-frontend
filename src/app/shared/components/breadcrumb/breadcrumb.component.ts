import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, map } from 'rxjs';

import { HOME } from '../../utils/app.constants';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  items: MenuItem[] = [];
  home: MenuItem = {
		icon: 'pi pi-home',
		routerLink: HOME
	};

  constructor( private router: Router, private activatedRoute: ActivatedRoute ) {}

  ngOnInit(): void {
    this.router.events.pipe(
			// Filter only NavigationEnd events
      filter(event => event instanceof NavigationEnd),
			// Build breadcrumb from activated route
      map(() => this.buildBreadcrumb(this.activatedRoute.root))
    ).subscribe(breadcrumbs => {
			// Check if route is valid
			this.setBreadcrumbIfValidRoute(breadcrumbs);
    });
  }

  private buildBreadcrumb( route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = [] ): MenuItem[] {
		// Get activated route
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }
		// If children
    for (const child of children) {
			// Build route
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
				//Add children to route
        breadcrumbs.push({
          label: routeURL.charAt(0).toUpperCase() + routeURL.slice(1),
          routerLink: url
        });
      }

      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

	private setBreadcrumbIfValidRoute(breadcrumbs: MenuItem[]): void {
		this.items = [];
		// If route is home leave empty
		if (this.router.url === HOME) {
			return;
		}
		// Get routes in routing and check if is valid
		const definedRoutes = this.router.config.map(route => route.path);
		const isValidRoute = definedRoutes.includes(this.router.url.split('/')[1]);

		if (isValidRoute) {
			this.items = breadcrumbs;
		}
	}


}
