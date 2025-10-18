import { inject, Injectable, signal } from '@angular/core';
import { AddressCreateDTO, AddressResponseDTO, AddressesService, AddressUpdateDTO } from '../../../api';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AddressesMainService {
    addressesService = inject(AddressesService);

    addresses = signal<AddressResponseDTO[]>([]);

    // Get addresses by user
    async getAllAddressesByUser(userId: string) {
        const addresses = await firstValueFrom(this.addressesService.addressesUserUserIdGet(userId));
        this.addresses.set(addresses.data || []);
        return addresses.data || [];
    }

    async createAddress(address: AddressCreateDTO) {
        const newAddress = await firstValueFrom(this.addressesService.addressesCreatePost(address));
        this.addresses.update((current) => [...current, newAddress.data!]);
        return newAddress.data;
    }

    async updateAddress(addressId: string, address: AddressUpdateDTO) {
        const updatedAddress = await firstValueFrom(this.addressesService.addressesUpdateIdPut(addressId, address));
        this.addresses.update((current) => current.map((addr) => (addr.id === addressId ? updatedAddress.data! : addr)));
        return updatedAddress.data;
    }

    async deleteAddress(addressId: string) {
        await firstValueFrom(this.addressesService.addressesDeleteIdDelete(addressId));
        this.addresses.update((current) => current.filter((addr) => addr.id !== addressId));
    }

    async getAddressById(addressId: string) {
        const address = await firstValueFrom(this.addressesService.addressesIdGet(addressId));
        return address.data;
    }

    // Convenience method to get addresses by current user (if needed)
    async getAddressesByUser(userId: string) {
        return this.getAllAddressesByUser(userId);
    }
}
