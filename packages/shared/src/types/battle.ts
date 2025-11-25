export type BattleResult = "win" | "lose";

export interface Battle {
  id: string;
  date: Date | string;
  opponent?: string | null;
  myDeck: string;
  opponentDeck?: string;
  mySideCount: number;
  opppnentSideCount: number;
  result: BattleResult;
  memo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface createBattleDto {
  date: string;
  opponent?: string | null;
  myDeck: string;
  opponentDeck?: string;
  mySideCount: number;
  opppnentSideCount: number;
  result: BattleResult;
  memo?: string | null;
}

export interface updatedBattleDto {
  date?: string;
  opponent?: string | null;
  myDeck?: string;
  opponentDeck?: string;
  mySideCount?: number;
  opppnentSideCount?: number;
  result?: BattleResult;
  memo?: string | null;
}
