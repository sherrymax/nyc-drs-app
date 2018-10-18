export class ReferenceDataModelAPIResponse {
    'data': ReferenceDataModel;
}
export class ReferenceDataModel {
    id: string;
    nycdrsId: string;
    labnextId: string;
    scan: string;
    externalId: string;
    doctorId: string;
    patient: string;
    sentDate: string;
    requestedDeliveryDate: string;
    owner: string;
    taskDescription: string;
    status: string;
    name: string;
    address: string;
}
export class DoctorDataModel {
    id: string;
    name: string;
    address: string;
}
