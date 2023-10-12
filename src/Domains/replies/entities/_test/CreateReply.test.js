const CreateReply = require('../CreateReply');

describe('CreateReply entities', () => {

    it('should throw error when payload did not contain needed property', () => {
        const payload = { content: 'Konten' };
        expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            commentId: true,
            content: true,
            owner: 'dicoding'
        };
        expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create CreateReply object correctly', () => {
        const payload = {
            commentId: 'comment',
            content: 'konten',
            owner: 'dicoding'
        };
        const { commentId, content, owner } = new CreateReply(payload);
        expect(commentId).toEqual(payload.commentId);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});
