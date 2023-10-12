const CreatedThread = require('../CreatedThread');


describe('CreatedThread entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'Ini title',
            owner : 'dicoding'
        };
        expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });


    it('should throw error when payload did not meet data type spesification', () => {
        const payload = {
            id : 123,
            title : true,
            owner : {}
        };
        expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });


    it('should create CreatedThred object correctly', () => {
        const payload = {
            id : '123',
            title : 'title',
            owner : 'dicoding'
        };
        const createdThread = new CreatedThread(payload);
        expect(createdThread.id).toEqual(payload.id);
        expect(createdThread.title).toEqual(payload.title);
        expect(createdThread.owner).toEqual(payload.owner);
    });

    
});