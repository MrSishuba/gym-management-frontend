
export class RewardViewModel{
    reward_ID!: number;
    reward_Issue_Date!: Date;
    reward_Type_Name!: string;
    isPosted!: boolean;
}

export class RewardTypeViewModel {
    reward_Type_ID!: number;
    reward_Type_Name!: string;
    reward_Criteria!: string;
  }

export class RewardRedeemViewModel {
    MemberId!: number;
    RewardId!: number;
}

export class UnredeemedRewardModel {
    reward_ID!: number;
    isRedeemed!: boolean;
    rewardTypeName!: string;
    rewardCriteria!: string;
  }

export class RewardSetViewModel {
    reward_Issue_Date!: Date;
    reward_Type_ID!: number;
    isPosted: boolean = false;
}

export class RewardPostViewModel {
    RewardId!: number;
}