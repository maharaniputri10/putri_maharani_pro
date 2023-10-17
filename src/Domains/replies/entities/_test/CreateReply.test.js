const CreateReply = require('../CreateReply');

describe('a CreateReply entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        const payload = { 
            content: 'Konten' 
        };

        expect(() => new CreateReply(payload)).toThrowError(
            'CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });
    

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: true,
            owner: { id: 'user-123' },
            commentId: 'comment-123',
        };

        expect(() => new CreateReply(payload)).toThrowError(
            'CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });


    it('should create CreateReply object correctly', () => {
        const payload = {
            content: 'content comment',
            owner: 'user-123',
            commentId: 'comment-123'
        };

        const createReply = new CreateReply(payload);

        expect(createReply).toBeInstanceOf(CreateReply);
        expect(createReply.content).toEqual(payload.content);
        expect(createReply.owner).toEqual(payload.owner);
        expect(createReply.commentId).toEqual(payload.commentId);
    });
});
