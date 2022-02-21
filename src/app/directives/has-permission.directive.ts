import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Permission, State } from '../store/state';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {

  @Input() hasPermission: string[] = [];

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store<{ state: State }>,
  ) { }

  ngOnInit(): void {
    this.store
      .select(it => it.state.profile?.permissions ?? [])
      .subscribe(permissions => {
        this.updateView(permissions)
      });
  }

  private updateView(userPermissions: Permission[]) {
    const requiredPermissions = this.hasPermission.map(it => Permission[it as keyof typeof Permission]);
    if (requiredPermissions.every(it => userPermissions.includes(it))) {
      this.viewContainer.createEmbeddedView(this.template);
    } else {
      this.viewContainer.clear();
    }
  }
}
