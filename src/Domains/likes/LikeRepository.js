class LikeRepository {
    async createLike(commentId, owner) { 
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyIsLikeExists(commentId, owner) { 
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteLike(commentId, owner) { 
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikeCount(commentId) { 
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  }
  
  module.exports = LikeRepository;