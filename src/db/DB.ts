export interface Constraint {
  type: string;
  name: string;
  count: number;
  description: string;
  resource: string;
}

export interface Constraints {
  requirements?: Constraint[];
  inputs?: Constraint[];
  outputs?: Constraint[];
}

export interface CraftGroup {
  literal: string;
  actions: Constraints[];
}

export interface CraftList {
  category: string;
  groups: CraftGroup[];
}
