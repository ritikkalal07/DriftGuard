import supabase from '../config/supabase.js';

/**
 * Get all projects for current user
 * GET /api/projects
 */
export const getProjects = async (req, res, next) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single project by ID
 * GET /api/projects/:id
 */
export const getProject = async (req, res, next) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get project statistics
    const { data: scans } = await supabase
      .from('scans')
      .select('id, high_drift_count, medium_drift_count, low_drift_count, missing_docs_count')
      .eq('project_id', project.id);

    const stats = {
      totalScans: scans?.length || 0,
      highDriftCount: scans?.reduce((sum, s) => sum + (s.high_drift_count || 0), 0) || 0,
      mediumDriftCount: scans?.reduce((sum, s) => sum + (s.medium_drift_count || 0), 0) || 0,
      lowDriftCount: scans?.reduce((sum, s) => sum + (s.low_drift_count || 0), 0) || 0,
      missingDocsCount: scans?.reduce((sum, s) => sum + (s.missing_docs_count || 0), 0) || 0
    };

    res.json({
      success: true,
      data: { 
        project,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new project
 * POST /api/projects
 */
export const createProject = async (req, res, next) => {
  try {
    const { name, description, repositoryPath, repositoryUrl, defaultBranch } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: req.user.id,
          name,
          description: description || null,
          repository_path: repositoryPath || null,
          repository_url: repositoryUrl || null,
          default_branch: defaultBranch || 'main'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 * PUT /api/projects/:id
 */
export const updateProject = async (req, res, next) => {
  try {
    const { name, description, repositoryPath, repositoryUrl, defaultBranch } = req.body;

    // Check if project exists and belongs to user
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Build update object
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (repositoryPath !== undefined) updates.repository_path = repositoryPath;
    if (repositoryUrl !== undefined) updates.repository_url = repositoryUrl;
    if (defaultBranch !== undefined) updates.default_branch = defaultBranch;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    // Check if project exists and belongs to user
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete project (cascade will handle related records)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project scans
 * GET /api/projects/:id/scans
 */
export const getProjectScans = async (req, res, next) => {
  try {
    // Check if project exists and belongs to user
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const { data: scans, error } = await supabase
      .from('scans')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({
      success: true,
      data: { scans }
    });
  } catch (error) {
    next(error);
  }
};

// Made with Bob
