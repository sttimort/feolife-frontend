import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { first, mergeMap, Observable } from "rxjs";
import { State } from "src/app/store/reducer";

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor {
    constructor(
        private store: Store<{ state: State }>,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select(it => it.state.authToken)
            .pipe(
                first(),
                mergeMap(token => {
                    const effectiveRequest = token != null
                        ? request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        : request;

                    return next.handle(effectiveRequest);
                })
            );
    }
}