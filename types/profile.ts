export interface ProfileInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  passwordHash: string;
}

export interface CycleStatus {
  isRegistruationComplete: boolean;
  inOnboardingCompleted: boolean;
}

export interface Profile {
  _id: string;
  profileInfo: ProfileInfo;
  cycleStatus: CycleStatus;
}
