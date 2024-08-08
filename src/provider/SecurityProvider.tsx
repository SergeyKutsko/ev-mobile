import { Action, Entity, Role } from '../types/Authorization';
import SiteArea from '../types/SiteArea';
import { TenantComponents } from '../types/Tenant';
import UserToken from '../types/UserToken';

export default class SecurityProvider {
  private loggedUser: UserToken;

  public constructor(loggedUser: UserToken) {
    this.loggedUser = loggedUser;
  }

  public isAdmin(): boolean {
    return this.loggedUser.role === Role.ADMIN;
  }

  public hasSiteAdmin(): boolean {
    if (this.isAdmin()) {
      return true;
    }
    return this.loggedUser.sitesAdmin && this.loggedUser.sitesAdmin.length > 0;
  }

  public isSiteAdmin(siteID: string): boolean {
    if (this.isAdmin()) {
      return true;
    }
    if (this.canAccess(Entity.SITE, Action.UPDATE)) {
      return this.loggedUser.sitesAdmin && this.loggedUser.sitesAdmin.includes(siteID);
    }
    return false;
  }

  public isSiteUser(siteID: string): boolean {
    if (this.isAdmin()) {
      return true;
    }
    if (this.canAccess(Entity.SITE, Action.READ)) {
      return this.loggedUser.sites && this.loggedUser.sites.includes(siteID);
    }
    return false;
  }

  public isBasic(): boolean {
    return this.loggedUser.role === Role.BASIC;
  }

  public isDemo(): boolean {
    return this.loggedUser.role === Role.DEMO;
  }

  public isComponentPricingActive(): boolean {
    return this.isComponentActive(TenantComponents.PRICING);
  }

  public isComponentOrganizationActive(): boolean {
    return this.isComponentActive(TenantComponents.ORGANIZATION);
  }

  public isComponentCarActive(): boolean {
    return this.isComponentActive(TenantComponents.CAR);
  }

  public isComponentBillingActive(): boolean {
    return this.isComponentActive(TenantComponents.BILLING);
  }

  public isComponentActive(componentName: string): boolean {
    if (this.loggedUser && this.loggedUser.activeComponents) {
      return this.loggedUser.activeComponents.includes(componentName);
    }
    return false;
  }

  public canUpdateChargingStation(): boolean {
    return this.canAccess(Entity.CHARGING_STATION, Action.UPDATE);
  }

  public canStopTransaction(siteArea: SiteArea, badgeID: string): boolean {
    if (this.canAccess(Entity.CHARGING_STATION, Action.REMOTE_STOP_TRANSACTION)) {
      // TO CHANGE
      if (this.loggedUser.tagIDs.includes(badgeID)) {
        return true;
      }
      if (this.isComponentActive(TenantComponents.ORGANIZATION)) {
        return siteArea && this.isSiteAdmin(siteArea.siteID);
      }
      return this.isAdmin();
    }
    return false;
  }

  public canStartTransaction(siteArea: SiteArea): boolean {
    if (this.canAccess(Entity.CHARGING_STATION, Action.REMOTE_START_TRANSACTION)) {
      if (this.isComponentActive(TenantComponents.ORGANIZATION)) {
        if (!siteArea) {
          return false;
        }
        return !siteArea.accessControl || this.isSiteAdmin(siteArea.siteID) || this.loggedUser.sites.includes(siteArea.siteID);
      }
      return true;
    }
    return false;
  }

  public canReadTransaction(): boolean {
    return this.canAccess(Entity.TRANSACTION, Action.READ);
  }

  public canAccess(resource: string, action: string): boolean {
    return this.loggedUser && this.loggedUser.scopes && (this.loggedUser.scopes.includes(`${resource}:${action}`)
      //TODO remove the plural (s) when backend new authorization deployed
      || this.loggedUser.scopes.includes(`${resource}s:${action}`));
  }

  public canListUsers(): boolean {
    return this.canAccess(Entity.USER, Action.LIST);
  }

  public canListTags(): boolean {
    return this.canAccess(Entity.TAG, Action.LIST);
  }

  public canListCars(): boolean {
    return this.canAccess(Entity.CAR, Action.LIST);
  }

  public canListInvoices(): boolean {
    return this.canAccess(Entity.INVOICE, Action.LIST);
  }

  public canListPaymentMethods(): boolean {
    return this.canAccess(Entity.PAYMENT_METHOD, Action.LIST);
  }
}
