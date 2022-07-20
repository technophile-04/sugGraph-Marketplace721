import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
	ItemBought as ItemBoughtEvent,
	ItemCanceled as ItemCanceledEvent,
	ItemListed as ItemListedEvent,
} from '../generated/NFTMarketplace/NFTMarketplace';
import {
	ItemListed,
	ItemBought,
	ItemCanceled,
	ActiveItem,
} from '../generated/schema';

export function handleItemBought(event: ItemBoughtEvent): void {
	let itemBought = ItemBought.load(
		getIdFromEventParams(event.params.tokenId, event.params.nftContractAddress)
	);

	const activeItem = ActiveItem.load(
		getIdFromEventParams(event.params.tokenId, event.params.nftContractAddress)
	);

	if (!itemBought) {
		itemBought = new ItemBought(
			getIdFromEventParams(
				event.params.tokenId,
				event.params.nftContractAddress
			)
		);
	}

	itemBought.buyer = event.params.buyer;
	itemBought.tokenId = event.params.tokenId;
	itemBought.nftContractAddress = event.params.nftContractAddress;
	itemBought.price = event.params.price;

	activeItem!.buyer = event.params.buyer;

	itemBought.save();
	activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
	let itemCanceled = ItemCanceled.load(
		getIdFromEventParams(event.params.tokenId, event.params.nftContractAddress)
	);

	const activeItem = ActiveItem.load(
		getIdFromEventParams(event.params.tokenId, event.params.nftContractAddress)
	);

	if (!itemCanceled) {
		itemCanceled = new ItemCanceled(
			getIdFromEventParams(
				event.params.tokenId,
				event.params.nftContractAddress
			)
		);
	}

	itemCanceled.seller = event.params.seller;
	itemCanceled.tokenId = event.params.tokenId;
	itemCanceled.nftContractAddress = event.params.nftContractAddress;

	activeItem!.buyer = Address.fromString(
		'0x000000000000000000000000000000000000dEaD'
	);

	itemCanceled.save();
	activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
	let itemListed = ItemListed.load(
		getIdFromEventParams(event.params.tokenId, event.params.nftContractAddress)
	);

	let activeItem = ActiveItem.load(
		getIdFromEventParams(event.params.tokenId, event.params.nftContractAddress)
	);

	if (!itemListed) {
		itemListed = new ItemListed(
			getIdFromEventParams(
				event.params.tokenId,
				event.params.nftContractAddress
			)
		);
	}

	if (!activeItem) {
		activeItem = new ActiveItem(
			getIdFromEventParams(
				event.params.tokenId,
				event.params.nftContractAddress
			)
		);
	}

	itemListed.seller = event.params.seller;
	itemListed.tokenId = event.params.tokenId;
	itemListed.nftContractAddress = event.params.nftContractAddress;
	itemListed.price = event.params.price;

	activeItem.seller = event.params.seller;
	activeItem.tokenId = event.params.tokenId;
	activeItem.nftContractAddress = event.params.nftContractAddress;
	activeItem.price = event.params.price;

	itemListed.save();
	activeItem.save();
}

function getIdFromEventParams(
	tokenId: BigInt,
	nftContractAddress: Address
): string {
	return `${tokenId.toString()}${nftContractAddress}`;
}
