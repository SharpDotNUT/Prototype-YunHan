export interface PoolData {
  name: string;
  img: string;
  order: number;
  type: 301 | 302 | 400 | 500;
  star5: number[];
  star4: number[];
  from: string; // ISO 8601
  to: string; // ISO 8601
}

export interface PoolStruct {
  [version: string]: {
    [phase: string]: string[];
  };
}

export interface GachaData {
  poolData: {
    [poolId: string]: PoolData;
  };
  poolStruct: PoolStruct;
}
