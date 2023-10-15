const CreateComment = require('../CreateComment');

describe(' a CreateComment entities', () => {
    
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'content Comment'
        };
        expect(() => new CreateComment(payload)).toThrowError(
            'CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
            );
    });
    
    
    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: true,
            owner: { id: 'dicoding-123' },
            threadId: 'thread-123'
        };

        expect(() => new CreateComment(payload)).toThrowError(
            'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });


    it('should create CreateComment object correctly', () => {
        const payload = {
            content: 'content comment',
            owner: 'dicoding-123',
            threadId: 'thread-123',
          };

        const createComment = new CreateComment(payload);

        expect(createComment).toBeInstanceOf(CreateComment);
        expect(createComment.content).toEqual(payload.content);
        expect(createComment.owner).toEqual(payload.owner);
        expect(createComment.threadId).toEqual(payload.threadId);
    });
    
});
