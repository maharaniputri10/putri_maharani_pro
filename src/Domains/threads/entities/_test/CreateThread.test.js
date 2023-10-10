const CreateThread = require('../CreateThread');


describe('CreateThread entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        const payload = {title: 'title'};
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    
    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title : 123,
            body : true,
            owner : 'dicoding'
        };
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });


    it('should create CreateThread object correctly', () => {
        const payload = {
            title : 'title',
            body : 'body',
            owner : 'dicoding'
        };
        const { title, body, owner } = new CreateThread(payload);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });

    
});
