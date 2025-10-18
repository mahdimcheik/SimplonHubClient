import { CategoryCursus, CategoryCursusDTO, LanguageResponseDTO, ProgrammingLanguageResponseDTO } from '../../../api';

export const languagesOptions: LanguageResponseDTO[] = [
    {
        id: '87a0a5ed-c7bb-4394-a163-7ed7560b3703',
        name: 'Arab',
        color: '#ab69b4',
        createdAt: new Date('2023-10-10T14:20:30.123Z')
    },
    {
        id: '4a5eaf2f-0496-4035-a4b7-9210da39501c',
        name: 'English',
        color: '#fa69b4',
        createdAt: new Date('2023-10-10T14:20:30.123Z')
    },
    {
        id: 'bde5556b-562d-431f-9ff9-d31a5f5cb8c5',
        name: 'French',
        color: '#ff69b4',
        createdAt: new Date('2023-10-10T14:20:30.123Z')
    },
    {
        id: '41f1f997-c392-4aac-bef0-fc8acaf109ec',
        name: 'Spanish',
        color: '#ab69b4',
        createdAt: new Date('2023-10-10T14:20:30.123Z')
    }
];

export const programmingLanguagesOptions: ProgrammingLanguageResponseDTO[] = [
    {
        id: '87a0a5ed-c7bb-4394-a163-7ed7560b3703',
        name: 'C#',
        color: '#ab69b4',
        icon: '',
        description: null,
        createdAt: new Date('2025-10-05T19:36:46.701841+00:00'),
        updatedAt: new Date('2025-10-05T19:36:46.70184+00:00')
    },
    {
        id: '41f1f997-c392-4aac-bef0-fc8acaf109ec',
        name: 'C++',
        color: '#ab69b4',
        icon: '',
        description: null,
        createdAt: new Date('2025-10-05T19:36:46.701841+00:00'),
        updatedAt: new Date('2025-10-05T19:36:46.701841+00:00')
    },
    {
        id: '4a5eaf2f-0496-4035-a4b7-9210da39501c',
        name: 'Java',
        color: '#fa69b4',
        icon: '',
        description: null,
        createdAt: new Date('2025-10-05T19:36:46.70184+00:00'),
        updatedAt: new Date('2025-10-05T19:36:46.70184+00:00')
    },
    {
        id: 'bde5556b-562d-431f-9ff9-d31a5f5cb8c5',
        name: 'JavaScript',
        color: '#ff69b4',
        icon: '',
        description: null,
        createdAt: new Date('2025-10-05T19:36:46.70184+00:00'),
        updatedAt: new Date('2025-10-05T19:36:46.70184+00:00')
    }
];

export const categories: CategoryCursusDTO[] = [
    {
        id: '41f1f997-c392-4aac-bef0-fc8acaf109ec',
        name: 'Back-end',
        color: '#ab69b4',
        icon: ''
    },
    {
        id: '87a0a5ed-c7bb-4394-a163-7ed7560b3703',
        name: 'Front-end',
        color: '#ab69b4',
        icon: ''
    },
    {
        id: '4a5eaf2f-0496-4035-a4b7-9210da39501c',
        name: 'Soft skills',
        color: '#ff69b4',
        icon: ''
    },
    {
        id: 'bde5556b-562d-431f-9ff9-d31a5f5cb8c5',
        name: 'Technics',
        color: '#fa69b4',
        icon: ''
    }
];
