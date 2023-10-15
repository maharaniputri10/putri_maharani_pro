const CreateThread = require('../CreateThread');


describe('CreateThread entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'title'
        };

        expect(() => new CreateThread(payload)).toThrowError(
            'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });
    
    
    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title : 123,
            body : true,
            owner : 'dicoding-123'
        };
        expect(() => new CreateThread(payload)).toThrowError(
            'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });


    it('should create CreateThread object correctly', () => {
        const payload = {
            title : 'title',
            body : 'body',
            owner : 'dicoding-123'
        };
        const createThread = new CreateThread(payload);

        expect(createThread).toBeInstanceOf(CreateThread);
        expect(createThread.title).toEqual(payload.title);
        expect(createThread.body).toEqual(payload.body);
        expect(createThread.owner).toEqual(payload.owner);
    });

    
});
