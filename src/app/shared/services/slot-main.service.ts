import { inject, Injectable, signal } from '@angular/core';
import { BookingCreateDTO, BookingUpdateDTO, SlotCreateDTO, SlotResponseDTO, SlotsService, SlotUpdateDTO, TypeSlotResponseDTO, TypeSlotService } from '../../../api';
import { firstValueFrom } from 'rxjs';
import { CustomTableState } from '../../generic-components/smart-grid';

@Injectable({
    providedIn: 'root'
})
export class SlotMainService {
    slotsService = inject(SlotsService);
    typeSlotService = inject(TypeSlotService);

    slots = signal<SlotResponseDTO[]>([]);
    TypeSlot = signal<TypeSlotResponseDTO[]>([]);
    totalRecords = signal(0);

    // Get slots by user
    async getAllSlotsByUser(userId: string) {
        const slots = await firstValueFrom(this.slotsService.slotsTeacherTeacherIdGet(userId));
        this.slots.set(slots.data || []);
        return slots.data || [];
    }

    async getAllSlots(filters: CustomTableState) {
        const slots = await firstValueFrom(this.slotsService.slotsAllPost(filters));
        this.slots.set(slots.data || []);
        return slots.data || [];
    }

    async getSlotById(slotId: string) {
        const slot = await firstValueFrom(this.slotsService.slotsIdGet(slotId));
        return slot.data;
    }

    async getAllSlotsByStudent(dateFrom: Date, dateTo: Date, teacherId?: string) {
        const slots = await firstValueFrom(this.slotsService.slotsStudentGet(dateFrom, dateTo, teacherId));
        this.slots.set(slots.data || []);
        return slots.data || [];
    }

    async createSlot(slot: SlotCreateDTO) {
        const newSlot = await firstValueFrom(this.slotsService.slotsCreatePost(slot));
        this.slots.update((current) => [...current, newSlot.data!]);
        return newSlot.data;
    }

    async updateSlot(slotId: string, slot: SlotUpdateDTO) {
        const updatedSlot = await firstValueFrom(this.slotsService.slotsUpdateIdPut(slotId, slot));
        this.slots.update((current) => current.map((s) => (s.id === slotId ? updatedSlot.data! : s)));
        return updatedSlot.data;
    }

    async updateBooking(booking: BookingUpdateDTO) {
        const updatedBooking = await firstValueFrom(this.slotsService.slotsUpdateBookingPut(booking));
        return updatedBooking.data;
    }

    async confirmBooking(bookingId: string) {
        const confirmedBooking = await firstValueFrom(this.slotsService.slotsConfirmBookingIdPut(bookingId));
        return confirmedBooking.data;
    }

    async deleteSlot(slotId: string, force: boolean = false) {
        await firstValueFrom(this.slotsService.slotsDeleteIdDelete(slotId, force));
        this.slots.update((current) => current.filter((s) => s.id !== slotId));
    }

    async deleteBooking(bookingId: string) {
        await firstValueFrom(this.slotsService.slotsUnbookIdPost(bookingId));
    }

    async getAllTypeSlot() {
        const typeSlot = await firstValueFrom(this.typeSlotService.typeslotAllGet());
        this.TypeSlot.set(typeSlot.data || []);
        return typeSlot.data || [];
    }

    // get all type slot
    async getTypeSlot() {
        const typeSlot = await firstValueFrom(this.typeSlotService.typeslotAllGet());
        this.TypeSlot.set(typeSlot.data || []);
        return typeSlot.data || [];
    }

    // book slot
    async bookSlot(booking: BookingCreateDTO) {
        const bookedSlot = await firstValueFrom(this.slotsService.slotsBookPost(booking));
        return bookedSlot.data;
    }

    // unbook slot
    async unbookSlot(slotId: string) {
        const unbookedSlot = await firstValueFrom(this.slotsService.slotsUnbookIdPost(slotId));
        this.slots.update((current) => current.map((s) => (s.id === slotId ? unbookedSlot.data! : s)));
        return unbookedSlot.data;
    }
}
