
const CreatedComment = require('../CreatedComment');


describe('CreatedComment entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'coment',
            owner : 'dicoding'
        };
        expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });


    it('should throw error when payload did not meet data type spesification', () => {
        const payload = {
            id : 123,
            content : true,
            owner : {}
        };
        expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });


    it('should create CreatedComment object correctly', () => {
        const payload = {
            id : '123',
            content : 'komentar',
            owner : 'dicoding'
        };
        const createdComment = new CreatedComment(payload);
        expect(createdComment.id).toEqual(payload.id);
        expect(createdComment.content).toEqual(payload.content);
        expect(createdComment.owner).toEqual(payload.owner);
    });


    
});