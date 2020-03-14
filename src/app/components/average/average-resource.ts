export namespace AverageSource {
	export enum AverageMechanismType {
		bubbling = 'bubbling',
		multichannel_width = 'multichannel_width',
		multichannel_length = 'multichannel_length',
	}
	export const averageCoefficientBorder = 5;
	export enum AverageDeep {
		min = 3,
		max = 6,
	}
	export enum AverageChannelLengthDeep {
		min = 0,
		max = 2,
	}
	export const minAmountOfSection = 2;
	export const checkSpeed = 0.0025;
	export enum BubbleDeep {
		min = 3,
		max = 5,
	}
	export const intensiveWallBubble = 6;
	export const intensiveIntervalBubble = 12;
	export enum BubbleDistanceWall {
		min = 1,
		max = 1.5,
	}
	export enum BubbleDistanceInterval {
		min = 2,
		max = 3,
	}
	export const minAmountOfSectionChannel = 3;
	export const minAmountOfSectionChannelLength = 4;
	export enum SectionChannelWidth {
		min = 1,
		max = 6,
	}
	export const minWaterSpeedInTray = 0.4;
	export enum CoefficientHoleFlow {
		bottom = 0.8,
		side = 0.7,
	}
	export const gravityAcceleration = 9.8;
	export enum ChannelWidth {
		min = 1,
		max = 10,
	}
}
