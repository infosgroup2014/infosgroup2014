import { KeycloakService } from "keycloak-angular";
import { environment } from "../../../../environments/environment";

//remoto

export function initializeKeycloak(
  keycloak: KeycloakService
) {
  return () =>
    keycloak.init({
      config: {
        url: `${environment.keycloakConfig.url}/auth`,
        realm: `${environment.keycloakConfig.realm}`,
        clientId: `${environment.keycloakConfig.clientId}`,
      }
    });
}



/*export function initializeKeycloak(
  keycloak: KeycloakService
) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://138.128.245.244:8443' + '/auth',
        realm: 'Planilla',
        clientId: 'frontend',
      }

    });
}*/

/*

*/



//local



/*export function initializeKeycloak(
  keycloak: KeycloakService
  ) {
    return () =>
      keycloak.init({
        config: {
          url: 'http://192.168.1.16:8080' + '/auth',
          realm: 'Demo-Realm',
          clientId: 'frontend',
        }
      });
}*/


